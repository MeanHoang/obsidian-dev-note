#!/usr/bin/env python3
"""Rà tín hiệu không hài lòng trong toàn bộ lịch sử Claude Code.

Cải tiến so với bản grep keyword:
  1. Quét CẢ 2 nguồn: transcript (đầy đủ, 06->08) + history.jsonl (thưa, 03->08)
  2. Chuẩn hoá tiếng Việt: bỏ dấu + gõ tắt -> bắt được "khoong/ko", "nể", "đc"
  3. Tín hiệu CẤU TRÚC, không chỉ từ khoá:
       - INTERRUPT : user bấm ESC cắt ngang assistant  (bực, mạnh nhất)
       - AFTER_EDIT: user phản hồi ngay sau khi AI vừa Edit/Write (sửa lưng)
       - SHORT_NEG : câu ngắn + phủ định ("không", "sai rồi", "revert")
       - REPEAT    : user lặp lại ý cũ trong <5 lượt (AI không hiểu)
  4. Chấm điểm & gom nhóm theo rule thay vì in thô
"""
import json, os, re, sys, unicodedata, glob
from collections import defaultdict, Counter
from datetime import datetime, timezone

HOME = os.path.expanduser("~")
PROJ = os.path.join(HOME, ".claude", "projects")
HIST = os.path.join(HOME, ".claude", "history.jsonl")

# ---------- chuẩn hoá tiếng Việt ----------
def norm(s):
    s = s.lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d")
    s = re.sub(r"\s+", " ", s)
    return s

# ---------- bộ luật: rule -> pattern (đã bỏ dấu) ----------
RULES = {
    "SCOPE/chi-check-dung-sua": r"check thoi|doc thoi|xem thoi|phan tich thoi|read ?only|dung sua|đung sua|khong sua voi|ko sua voi|chua sua voi|dung voi sua|dung update|dung can thiep|dung doi branch|khong lien quan|ko lien quan|dung sua thu",
    "GIT/branch-commit-stash": r"nham bran|sai bran|1 bran thoi|mot bran thoi|bran moi chu|chua bao commit|dung commit|dung push|sao lai commit|tach bran|unversion|unverrison|mat file|stash",
    "CODE/thua-kho-hieu":      r"du code|thua |kho hieu|lon son|hon loan|roi qua|wrapper|viet lai tu dau|don gian hon|toi uu lai|code ban|refactor lai di",
    "PATTERN/khong-be-mau":    r"be ve|tham khao|ham tuong tu|pattern|copy tu|giong ham|sao khong lay|sao lai can doc lai",
    "I18N/translation":        r"ban dich|cuoi file|cuoi dong|key dich|translate|dich bi|conflict dich",
    "LINT/eslint-ca-file":     r"es ?lint|lint ca file|reformat|diff bi sua do",
    "UI/xau-khong-nhat-quan":  r"xau |te vay|te qua|thiet ke lai|khong dep|nhin te|bo khung|kho nhin|xau vkl|chua dep",
    "VERIFY/bia-doan-mo":      r"bia |doan mo|chac chua|chac khong|dan chung|bang chung|verify lai|check ky|dung khong nhi|that khong|co that",
    "AUTO/tu-y-hanh-dong":     r"tu y|ai cho|sao lai tu|dung tu |khong duoc tu|toi hoi thoi|chi hoi thoi|dung lam gi",
    "MEMORY/vi-pham-rule-cu":  r"memory toi|nhac roi|co nhac|note memory roi|da bao|bao roi|da noi|noi roi|lai nua|dan roi",
    # --- 5 rule phát hiện thêm từ nhóm chưa phân loại ---
    "INCOMPLETE/tra-loi-thieu":  r"phai noi du|noi du ca|sao co \d+ cai thoi|hoi thieu|con thieu|thieu gi|chua du|day du chi tiet|dung thu tu|liet ke du|het chua|con gi nua",
    "MISREAD/hieu-sai-cau-hoi":  r"^(khong|ko)\b.{0,60}(y toi|toi dang noi|toi hoi|co ma|co mà|chu|dau)|hieu sai|toi dang dat van de|ko phai y|khong phai y",
    "NAMING/dat-ten-kho-hieu":   r"dat ten|ten file la|goi la|nghe cha hieu|ten ham|ten bien|sao lai goi",
    "DOC-INSTEAD-OF-WORK":       r"\.md la gi|md lam gi|tao file md|viet doc lam gi|xin link|tao mr",
    "AUTOCOMMIT/tu-commit":      r"commit luon roi|da commit roi a|sao commit|push luon roi",
}
# tín hiệu bực chung (dùng để chấm điểm, không phải rule)
ANGER = r"vkl|vcl|nể|ne vkl|me |dm |deo |lay bo|chan qua|buc |sao lai|tai sao|\?\?\?"
SHORT_NEG = r"^(khong|ko|sai|revert|dung|stop|huy|bo di|lam lai)\b"

def bucket(t):
    """trả về set các rule khớp"""
    n = norm(t)
    return {k for k, p in RULES.items() if re.search(p, n)}

def anger_score(t):
    n = norm(t)
    s = len(re.findall(ANGER, n))
    if re.search(SHORT_NEG, n.strip()) and len(n) < 80:
        s += 2
    return s

# ---------- nguồn 1: transcript ----------
def read_transcripts():
    out = []
    files = [f for f in glob.glob(os.path.join(PROJ, "*", "*.jsonl"))]
    for fp in files:
        project = os.path.basename(os.path.dirname(fp))
        since_edit = 99  # số lượt kể từ lần AI Edit/Write gần nhất
        try:
            with open(fp, errors="ignore") as fh:
                for line in fh:
                    try:
                        r = json.loads(line)
                    except Exception:
                        continue
                    typ = r.get("type")
                    msg = r.get("message") or {}
                    c = msg.get("content")
                    # gom tool assistant vừa dùng
                    if typ == "assistant" and isinstance(c, list):
                        tools = {b.get("name") for b in c if b.get("type") == "tool_use"}
                        if tools & {"Edit", "Write", "NotebookEdit"}:
                            since_edit = 0
                        elif tools:
                            since_edit += 1
                        continue
                    if typ != "user" or r.get("isMeta"):
                        continue
                    if isinstance(c, str):
                        text = c
                    elif isinstance(c, list):
                        text = "\n".join(b.get("text", "") for b in c if b.get("type") == "text")
                    else:
                        continue
                    if not text.strip():
                        continue
                    interrupted = "Request interrupted by user" in text
                    # bỏ nhiễu hệ thống nhưng GIỮ lại tín hiệu interrupt
                    if not interrupted and re.search(
                        r"<system-reminder>|<task-notification>|^This session is being continued|^Review this change for security|Caveat: The messages below", text):
                        continue
                    text = re.sub(r"<ide_(opened_file|selection)>.*?</ide_\1>", "", text, flags=re.S).strip()
                    if not text:
                        continue
                    out.append({
                        "ts": (r.get("timestamp") or "")[:10],
                        "project": project, "src": "transcript", "text": text,
                        "after_edit": since_edit <= 3,
                        "interrupted": interrupted,
                    })
                    since_edit = 99
        except Exception:
            continue
    return out

# ---------- nguồn 2: history.jsonl (cũ hơn, phủ nhiều project) ----------
def read_history():
    out = []
    if not os.path.exists(HIST):
        return out
    with open(HIST, errors="ignore") as fh:
        for line in fh:
            try:
                r = json.loads(line)
            except Exception:
                continue
            t = r.get("display") or ""
            if not t.strip():
                continue
            ts = r.get("timestamp")
            day = datetime.fromtimestamp(ts / 1000, timezone.utc).strftime("%Y-%m-%d") if ts else ""
            out.append({"ts": day, "project": os.path.basename(r.get("project", "")),
                        "src": "history", "text": t, "after_edit": False, "interrupted": False})
    return out

# ---------- chạy ----------
rows = read_transcripts() + read_history()
# khử trùng lặp (history & transcript chồng nhau)
seen, uniq = set(), []
for r in rows:
    k = (r["ts"], norm(r["text"])[:120])
    if k in seen:
        continue
    seen.add(k)
    uniq.append(r)

hits = []
for r in uniq:
    rs = bucket(r["text"])
    sc = anger_score(r["text"]) + (3 if r["interrupted"] else 0)
    # after_edit chỉ CỘNG ĐIỂM khi đã có tín hiệu khác, không tự nó thành hit
    if r["after_edit"] and (rs or sc):
        sc += 1
    if rs or sc >= 2:
        r["rules"] = rs or {"KHAC/khong-phan-loai"}
        r["score"] = sc
        hits.append(r)

print(f"TỔNG message user (đã khử trùng): {len(uniq)}")
print(f"  - transcript: {sum(1 for r in uniq if r['src']=='transcript')}")
print(f"  - history   : {sum(1 for r in uniq if r['src']=='history')}")
print(f"CÓ TÍN HIỆU  : {len(hits)}  ({100*len(hits)//max(len(uniq),1)}%)")
print(f"  - bị ngắt (ESC)       : {sum(1 for r in hits if r['interrupted'])}")
print(f"  - ngay sau khi AI Edit: {sum(1 for r in hits if r['after_edit'])}")

print("\n=== THEO RULE ===")
cnt = Counter()
for r in hits:
    for x in r["rules"]:
        cnt[x] += 1
for k, v in cnt.most_common():
    print(f"{v:5d}  {k}")

print("\n=== THEO THÁNG ===")
per = defaultdict(lambda: [0, 0])
for r in uniq:
    per[r["ts"][:7]][0] += 1
for r in hits:
    per[r["ts"][:7]][1] += 1
for m in sorted(per):
    tot, h = per[m]
    if tot:
        print(f"{m}  {h:4d}/{tot:5d}  = {100*h//tot:2d}%")

print("\n=== THEO PROJECT ===")
pp = Counter(r["project"] for r in hits)
for k, v in pp.most_common(8):
    print(f"{v:5d}  {k}")

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "hits.jsonl"), "w") as fh:
    for r in sorted(hits, key=lambda x: -x["score"]):
        r["rules"] = sorted(r["rules"])
        fh.write(json.dumps(r, ensure_ascii=False) + "\n")
print("\n-> chi tiết ghi ra hits.jsonl (sắp theo điểm bực giảm dần)")
