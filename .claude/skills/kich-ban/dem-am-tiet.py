#!/usr/bin/env python3
"""Đếm âm tiết lời thoại trong file kịch bản + soát tật giọng tiểu luận.

Dùng: python3 dem-am-tiet.py "<đường dẫn file kịch bản>"

Chỉ đếm phần LỜI THOẠI: bỏ heading, bảng, callout, list, code block,
ghi chú [HÌNH] và placeholder ⟨…⟩. Nhịp nói tiếng Việt ~160 âm tiết/phút.
"""
import io
import re
import sys

TU_CAM = [
    "Tuy nhiên", "Bên cạnh đó", "Hơn nữa", "Ngoài ra", "Nhìn chung",
    "Có thể thấy", "Đáng chú ý", "vô cùng", "cực kỳ", "đáng kể",
    "tuyệt vời", "hữu ích", "đáng kinh ngạc", "chìa khoá", "chìa khóa",
    "bức tranh toàn cảnh", "tảng băng", "con dao hai lưỡi",
]
NHIP = 160  # âm tiết / phút


def loi_thoai(text):
    """Trả về [(số dòng, nội dung)] của các dòng là lời thoại thật."""
    ra, trong_code = [], False
    for i, dong in enumerate(text.split("\n"), 1):
        t = dong.strip()
        if t.startswith("```"):
            trong_code = not trong_code
            continue
        if trong_code or not t:
            continue
        if t.startswith(("#", "|", ">", "-", "*", "[HÌNH]", "`[HÌNH]")):
            continue
        t = re.sub(r"`[^`]*`", "", t)          # bỏ inline code / ghi chú hình
        t = re.sub(r"⟨[^⟩]*⟩", "", t)          # bỏ placeholder
        if t.strip():
            ra.append((i, t))
    return ra


def main():
    if len(sys.argv) < 2:
        print("Dùng: python3 dem-am-tiet.py <file.md>")
        sys.exit(1)
    duong_dan = sys.argv[1]
    text = io.open(duong_dan, encoding="utf-8").read()
    dong_thoai = loi_thoai(text)
    noi_dung = "\n".join(t for _, t in dong_thoai)

    am_tiet = len(re.findall(r"[^\W\d_]+", noi_dung, re.UNICODE))
    phut, giay = divmod(round(am_tiet / NHIP * 60), 60)

    print(f"Âm tiết lời thoại : {am_tiet}")
    print(f"Thời lượng ước tính: {phut}:{giay:02d}  (@{NHIP} âm tiết/phút)")
    print()

    # --- soát tật giọng ---
    canh_bao = []

    gach = [n for n, t in dong_thoai if "—" in t or " - " in t]
    if gach:
        canh_bao.append(f"Gạch ngang chêm: {len(gach)} dòng → {gach[:8]}")

    phan_de = [n for n, t in dong_thoai
               if re.search(r"[Kk]hông phải .{2,60}?\.\s*(Là|Nó là|Thứ)", t)
               or re.search(r"chả phải .{2,60}?\.\s*(Là|Nó là)", t)]
    if len(phan_de) > 2:
        canh_bao.append(f'Phản đề "Không phải A. Là B.": {len(phan_de)} lần (tối đa 2) → {phan_de}')

    dinh = [(n, tu) for n, t in dong_thoai for tu in TU_CAM if tu.lower() in t.lower()]
    if dinh:
        canh_bao.append("Từ cấm: " + ", ".join(f"{tu} (dòng {n})" for n, tu in dinh))

    hat = len(re.findall(r"\b(ấy|thì|mà|đấy|cơ|nhé|nhỉ|chả|hoá ra|hóa ra|tại|kiểu)\b",
                         noi_dung, re.IGNORECASE))
    cau = max(1, len(re.findall(r"[.!?]", noi_dung)))
    ty_le = hat / cau
    if ty_le < 0.3:
        canh_bao.append(f"Hạt ngữ khí quá thưa: {hat} hạt / {cau} câu = {ty_le:.2f} (nên ≥ 0.3) → đang là giọng viết")
    elif ty_le > 1.2:
        canh_bao.append(f"Hạt ngữ khí quá dày: {ty_le:.2f} (nên ≤ 1.2) → đang giả vờ bình dân")

    con_trong = len(re.findall(r"⟨[^⟩]*⟩", text))
    if con_trong:
        canh_bao.append(f"Còn {con_trong} chỗ ⟨…⟩ chưa điền — CHƯA QUAY ĐƯỢC")

    if canh_bao:
        for c in canh_bao:
            print("⚠️  " + c)
    else:
        print("✅ Không phát hiện tật giọng nào.")


if __name__ == "__main__":
    main()
