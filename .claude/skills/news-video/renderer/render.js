#!/usr/bin/env node
'use strict'
/**
 * news-video renderer — 1 job = 1 video TikTok dọc 1080x1920.
 *
 *   node render.js job.json
 *
 * Job: xem job.example.json. Đầu ra: <outDir>/<slug>.mp4
 * Pipeline: Edge TTS (voice + word timing) -> ASS sub -> b-roll (Pexels/local) -> ffmpeg.
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const { EdgeTTS } = require('node-edge-tts')

/** Nạp renderer/.env vào process.env (không ghi đè biến đã có sẵn). File này nằm trong .gitignore. */
function loadDotEnv() {
  const file = path.join(__dirname, '.env')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!m || line.trim().startsWith('#')) continue
    const val = m[2].trim().replace(/^["']|["']$/g, '')
    if (val && !process.env[m[1]]) process.env[m[1]] = val
  }
}
loadDotEnv()

const WINGET = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet')

/** winget cài ffmpeg vào Packages\Gyan.FFmpeg*\<build>\bin và chỉ thêm vào PATH của shell mới. */
function wingetFfmpegDirs() {
  const root = path.join(WINGET, 'Packages')
  if (!fs.existsSync(root)) return []
  const dirs = []
  for (const pkg of fs.readdirSync(root)) {
    if (!/^Gyan\.FFmpeg/i.test(pkg)) continue
    const pkgDir = path.join(root, pkg)
    for (const build of fs.readdirSync(pkgDir)) {
      const bin = path.join(pkgDir, build, 'bin')
      if (fs.existsSync(bin)) dirs.push(bin)
    }
  }
  return dirs
}

function resolveBin(name) {
  const candidates = [
    process.env[name.toUpperCase() + '_PATH'],
    name,
    path.join(WINGET, 'Links', name + '.exe'),
    ...wingetFfmpegDirs().map((d) => path.join(d, name + '.exe')),
  ].filter(Boolean)
  for (const c of candidates) {
    try {
      execFileSync(c, ['-version'], { stdio: 'ignore' })
      return c
    } catch (_) {}
  }
  throw new Error('Không tìm thấy ' + name + '. Cài bằng: winget install Gyan.FFmpeg')
}

const log = (...a) => console.log('·', ...a)
const run = (bin, args, opts = {}) =>
  execFileSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts })

const probeDuration = (ffprobe, file) =>
  parseFloat(
    run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file])
  )

// ---------------------------------------------------------------- TTS + sub

/**
 * Bản đồ phiên âm: TTS đọc theo `value`, phụ đề hiển thị `key`.
 * Cần vì script vừa là lời đọc vừa là nguồn phụ đề — viết phiên âm cho đọc đúng
 * thì phụ đề lại hiện chữ phiên âm. Job override được, set '' để tắt 1 mục.
 */
const DEFAULT_PRONOUNCE = {
  OpenAI: 'Ô pen Ê Ai',
  GPT: 'Gi Pi Ti',
  dev: 'đép',
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const normWord = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

function resolvePronounce(job) {
  const map = { ...DEFAULT_PRONOUNCE, ...(job.pronounce || {}) }
  for (const k of Object.keys(map)) if (!map[k]) delete map[k]
  return map
}

/** Thay chữ hiển thị bằng chữ phiên âm trước khi đưa cho TTS. */
function toSpoken(script, map) {
  let out = script
  for (const [display, spoken] of Object.entries(map)) {
    out = out.replace(new RegExp(escapeRe(display), 'g'), spoken)
  }
  return out
}

/**
 * Gộp các từ thuộc một cụm phiên âm thành 1 "từ" mang chữ hiển thị gốc.
 * Làm ở mức word timing nên cụm phiên âm không bao giờ bị cắt ngang giữa 2 dòng phụ đề.
 */
function restoreWords(words, map) {
  const groups = Object.entries(map)
    .map(([display, spoken]) => ({ display, tokens: spoken.split(/\s+/).map(normWord).filter(Boolean) }))
    .sort((a, b) => b.tokens.length - a.tokens.length) // cụm dài khớp trước
  if (!groups.length) return words

  const out = []
  let i = 0
  while (i < words.length) {
    let matched = null
    for (const g of groups) {
      const slice = words.slice(i, i + g.tokens.length)
      if (slice.length < g.tokens.length) continue
      if (slice.every((w, k) => normWord(w.part) === g.tokens[k])) {
        matched = { g, slice }
        break
      }
    }
    if (matched) {
      const last = matched.slice[matched.slice.length - 1]
      const trail = /\s$/.test(last.part) ? ' ' : ''
      const punct = (last.part.match(/[.,!?…:;]+\s*$/) || [''])[0].trim()
      out.push({
        part: matched.g.display + punct + (trail || ' '),
        start: matched.slice[0].start,
        end: last.end,
      })
      i += matched.slice.length
    } else {
      out.push(words[i])
      i++
    }
  }
  return out
}

async function synth(job, workDir) {
  const mp3 = path.join(workDir, 'voice.mp3')
  const tts = new EdgeTTS({
    voice: job.voice || 'vi-VN-NamMinhNeural',
    lang: 'vi-VN',
    outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    saveSubtitles: true,
    rate: job.rate || '+8%',
    pitch: job.pitch || 'default',
    volume: job.volume || 'default',
    timeout: 120000,
  })
  const map = resolvePronounce(job)
  await tts.ttsPromise(toSpoken(job.script, map), mp3)

  const jsonPath = [mp3.replace(/\.mp3$/, '.json'), mp3 + '.json'].find((p) => fs.existsSync(p))
  if (!jsonPath) throw new Error('Edge TTS không trả về file timing phụ đề')
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  if (!raw.length) throw new Error('Timing phụ đề rỗng')
  const words = restoreWords(raw, map)
  return { mp3, words, restored: raw.length - words.length }
}

/** Gom word timing thành cue ngắn kiểu TikTok: 1 dòng, ngắt theo dấu câu / độ dài / thời lượng. */
function buildCues(words, opt = {}) {
  const maxChars = opt.maxChars || 26
  const maxDur = opt.maxDur || 2600
  const cues = []
  let cur = null
  const flush = () => {
    if (cur && cur.text.trim()) cues.push({ start: cur.start, end: cur.end, text: cur.text.replace(/\s+/g, ' ').trim() })
    cur = null
  }
  for (const w of words) {
    if (!cur) cur = { start: w.start, end: w.end, text: w.part }
    else {
      const merged = (cur.text + w.part).replace(/\s+/g, ' ').trim()
      if (merged.length > maxChars || w.end - cur.start > maxDur) {
        flush()
        cur = { start: w.start, end: w.end, text: w.part }
      } else {
        cur.text += w.part
        cur.end = w.end
      }
    }
    if (/[.!?…:;]["')\]]?\s*$/.test(cur.text)) flush()
  }
  flush()
  // cue quá ngắn thì kéo dài, tránh nhấp nháy; và không chồng lên cue sau
  for (let i = 0; i < cues.length; i++) {
    const next = cues[i + 1]
    if (cues[i].end - cues[i].start < 500) {
      cues[i].end = next ? Math.min(next.start, cues[i].start + 900) : cues[i].start + 900
    }
    if (next && next.start < cues[i].end) cues[i].end = next.start
  }
  return cues
}

const assTime = (ms) => {
  const cs = Math.max(0, Math.round(ms / 10))
  const h = Math.floor(cs / 360000)
  const m = Math.floor((cs % 360000) / 6000)
  const s = Math.floor((cs % 6000) / 100)
  const pad = (n) => String(n).padStart(2, '0')
  return h + ':' + pad(m) + ':' + pad(s) + '.' + pad(cs % 100)
}

function writeAss(cues, file, job) {
  const font = job.font || 'Segoe UI'
  const size = job.fontSize || 76
  const marginV = job.subtitleMarginV || 520
  const head = [
    '[Script Info]',
    'ScriptType: v4.00+',
    'PlayResX: 1080',
    'PlayResY: 1920',
    'WrapStyle: 2',
    'ScaledBorderAndShadow: yes',
    'YCbCr Matrix: TV.709',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Default,' + font + ',' + size + ',&H00FFFFFF,&H000000FF,&H00101010,&H90000000,-1,0,0,0,100,100,0,0,1,5,3,2,90,90,' + marginV + ',1',
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    '',
  ].join('\n')
  const body = cues
    .map((c) => {
      const text = c.text.replace(/[{}]/g, '').replace(/\r?\n/g, ' ')
      return 'Dialogue: 0,' + assTime(c.start) + ',' + assTime(c.end) + ',Default,,0,0,0,,' + text
    })
    .join('\n')
  fs.writeFileSync(file, head + body + '\n', 'utf8')
}

// ---------------------------------------------------------------- b-roll

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function pexelsFetch(term, key, cacheDir, want) {
  const url =
    'https://api.pexels.com/videos/search?orientation=portrait&size=medium&per_page=10&query=' +
    encodeURIComponent(term)
  const res = await fetch(url, { headers: { Authorization: key } })
  if (!res.ok) throw new Error('Pexels ' + res.status + ' cho "' + term + '" — kiểm tra PEXELS_API_KEY')
  const data = await res.json()
  const out = []
  for (const v of data.videos || []) {
    if (out.length >= want) break
    const file = (v.video_files || [])
      .filter((f) => f.width && f.height && f.height > f.width && f.height >= 1080)
      .sort((a, b) => a.height - b.height)[0]
    if (!file) continue
    const dest = path.join(cacheDir, v.id + '.mp4')
    if (!fs.existsSync(dest)) {
      const bin = await fetch(file.link)
      if (!bin.ok) continue
      fs.writeFileSync(dest, Buffer.from(await bin.arrayBuffer()))
      log('tải b-roll "' + term + '" -> ' + v.id + '.mp4')
    }
    out.push(dest)
  }
  return out
}

async function collectBroll(job) {
  if (job.broll) {
    const files = fs
      .readdirSync(job.broll)
      .filter((f) => /\.(mp4|mov|webm|mkv)$/i.test(f))
      .map((f) => path.join(job.broll, f))
    if (!files.length) throw new Error('Folder b-roll rỗng: ' + job.broll)
    log('b-roll local: ' + files.length + ' clip')
    return files
  }
  const key = job.pexelsKey || process.env.PEXELS_API_KEY
  if (!key) {
    throw new Error(
      'Chưa có b-roll. Set PEXELS_API_KEY (free tại pexels.com/api) hoặc thêm "broll": "<folder clip>" vào job.'
    )
  }
  const terms = job.terms || []
  if (!terms.length) throw new Error('Job thiếu "terms" để tìm b-roll')
  const files = []
  for (const t of terms) {
    const dir = path.join(__dirname, 'cache', slugify(t))
    fs.mkdirSync(dir, { recursive: true })
    const got = await pexelsFetch(t, key, dir, job.perTerm || 3)
    if (!got.length) log('⚠ không có clip dọc cho "' + t + '" — bỏ qua term này')
    files.push(...got)
  }
  if (!files.length) throw new Error('Không tải được clip nào. Đổi "terms" sang cảnh quay cụ thể hơn.')
  return files
}

/** Chọn & cắt clip cho đủ thời lượng. */
function planClips(pool, ffprobe, needSec, clipSec) {
  const durs = new Map()
  for (const f of pool) {
    try {
      const d = probeDuration(ffprobe, f)
      if (d > 0.8) durs.set(f, d)
    } catch (_) {}
  }
  if (!durs.size) throw new Error('Không clip nào đọc được bằng ffprobe')

  const shuffled = [...durs.keys()].sort(() => Math.random() - 0.5)
  const clips = []
  let total = 0
  let i = 0
  while (total < needSec + 0.5 && i < 400) {
    const file = shuffled[i % shuffled.length]
    const dur = durs.get(file)
    const take = Math.min(clipSec, dur)
    const offset = Math.max(0, (dur - take) / 2) // đoạn giữa clip thường đẹp hơn đoạn đầu
    clips.push({ file, take: +take.toFixed(2), offset: +offset.toFixed(2) })
    total += take
    i++
  }
  return clips
}

// ---------------------------------------------------------------- ghép

function pickBgm(job) {
  if (job.bgm === false) return null
  if (job.bgm && fs.existsSync(job.bgm)) return job.bgm
  const dir = path.join(__dirname, 'bgm')
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir).filter((f) => /\.(mp3|m4a|wav|aac)$/i.test(f))
  if (!files.length) return null
  return path.join(dir, files[Math.floor(Math.random() * files.length)])
}

function compose({ ffmpeg, clips, voice, bgm, workDir, outFile, duration, job }) {
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-stats']
  clips.forEach((c) => args.push('-ss', String(c.offset), '-t', String(c.take), '-i', c.file))
  args.push('-i', voice)
  if (bgm) args.push('-stream_loop', '-1', '-i', bgm)

  const vi = clips.length
  const bi = vi + 1
  let f = ''
  clips.forEach((_, i) => {
    f += '[' + i + ':v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[v' + i + '];'
  })
  f += clips.map((_, i) => '[v' + i + ']').join('') + 'concat=n=' + clips.length + ':v=1:a=0[vcat];'
  f += '[vcat]subtitles=sub.ass[vout]'
  if (bgm) {
    const vol = job.bgmVolume === undefined ? 0.12 : job.bgmVolume
    f += ';[' + bi + ':a]volume=' + vol + '[bg];[' + vi + ':a][bg]amix=inputs=2:duration=first:normalize=0[aout]'
  }

  args.push('-filter_complex', f)
  args.push('-map', '[vout]', '-map', bgm ? '[aout]' : vi + ':a')
  args.push(
    '-t', String(+(duration + 0.35).toFixed(2)),
    '-c:v', 'libx264', '-preset', job.preset || 'veryfast', '-crf', String(job.crf || 22),
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30',
    '-c:a', 'aac', '-b:a', '160k', '-ar', '44100',
    '-movflags', '+faststart',
    outFile
  )
  // cwd = workDir để filter subtitles dùng đường dẫn tương đối (tránh escape ổ đĩa trên Windows)
  run(ffmpeg, args, { cwd: workDir, stdio: ['ignore', 'inherit', 'inherit'] })
}

// ---------------------------------------------------------------- main

async function main() {
  const jobPath = process.argv[2]
  if (!jobPath) {
    console.error('Dùng: node render.js <job.json>')
    process.exit(2)
  }
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'))
  for (const k of ['slug', 'script']) if (!job[k]) throw new Error('Job thiếu "' + k + '"')

  const ffmpeg = resolveBin('ffmpeg')
  const ffprobe = resolveBin('ffprobe')

  const workDir = path.join(__dirname, 'work', job.slug)
  const outDir = job.outDir || path.join(__dirname, 'out')
  fs.mkdirSync(workDir, { recursive: true })
  fs.mkdirSync(outDir, { recursive: true })

  log('sinh giọng đọc…')
  const { mp3, words, restored } = await synth(job, workDir)
  const duration = probeDuration(ffprobe, mp3)
  log('voice ' + duration.toFixed(1) + 's · ' + words.length + ' từ' +
      (restored ? ' · ' + restored + ' từ phiên âm đã trả về chữ gốc' : ''))

  const cues = buildCues(words, { maxChars: job.maxChars, maxDur: job.maxCueDur })
  writeAss(cues, path.join(workDir, 'sub.ass'), job)
  log('phụ đề ' + cues.length + ' dòng')

  const pool = await collectBroll(job)
  const clips = planClips(pool, ffprobe, duration, job.clipDuration || 4)
  log('ghép ' + clips.length + ' clip từ ' + pool.length + ' nguồn')

  const bgm = pickBgm(job)
  if (bgm) log('nhạc nền: ' + path.basename(bgm))

  const outFile = path.join(outDir, job.slug + '.mp4')
  compose({ ffmpeg, clips, voice: mp3, bgm, workDir, outFile, duration, job })

  const size = fs.statSync(outFile).size
  console.log(
    '\nRESULT ' +
      JSON.stringify({
        file: outFile,
        duration: +duration.toFixed(2),
        cues: cues.length,
        clips: clips.length,
        sizeMB: +(size / 1048576).toFixed(1),
        bgm: bgm ? path.basename(bgm) : null,
      })
  )
}

main().catch((e) => {
  console.error('\n✗ ' + e.message)
  process.exit(1)
})
