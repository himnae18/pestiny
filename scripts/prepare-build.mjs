import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const builtEntry = resolve(distDir, 'dev.html')
const distIndex = resolve(distDir, 'index.html')
const rootIndex = resolve(root, 'index.html')
const rootAssets = resolve(root, 'assets')

const html = await readFile(builtEntry, 'utf8')
await writeFile(distIndex, html, 'utf8')
await rm(builtEntry)

// GitHub Actions 배포용 파일
await writeFile(resolve(distDir, '404.html'), html, 'utf8')

// 브랜치 직접 배포용 assets 동기화
await rm(rootAssets, { recursive: true, force: true })
await mkdir(rootAssets, { recursive: true })
await cp(resolve(distDir, 'assets'), rootAssets, { recursive: true })

// 더블클릭으로 열어도 보이도록 루트 index.html에는 CSS와 JS를 내장합니다.
const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+)">/)
const jsMatch = html.match(/<script type="module" crossorigin src="\.\/assets\/([^"]+)"><\/script>/)

if (!cssMatch || !jsMatch) {
  throw new Error('빌드 결과에서 CSS 또는 JS 파일을 찾지 못했습니다.')
}

const css = await readFile(resolve(distDir, 'assets', basename(cssMatch[1])), 'utf8')
const js = await readFile(resolve(distDir, 'assets', basename(jsMatch[1])), 'utf8')
const standaloneHtml = html
  .replace(cssMatch[0], `<style>${css.replaceAll('</style>', '<\\/style>')}</style>`)
  .replace(jsMatch[0], `<script>${js.replaceAll('</script>', '<\\/script>')}</script>`)

await writeFile(rootIndex, standaloneHtml, 'utf8')
await writeFile(resolve(root, '404.html'), standaloneHtml, 'utf8')

console.log('배포 파일 준비 완료: dist/ 및 더블클릭 가능한 루트 index.html')
