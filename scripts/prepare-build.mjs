import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const builtEntry = resolve(distDir, 'dev.html')
const distIndex = resolve(distDir, 'index.html')
const rootIndex = resolve(root, 'index.html')
const root404 = resolve(root, '404.html')
const rootAssets = resolve(root, 'assets')

// Vite가 dev.html 이름으로 만든 결과를 GitHub Pages용 index.html로 바꿉니다.
const html = await readFile(builtEntry, 'utf8')
await writeFile(distIndex, html, 'utf8')
await rm(builtEntry)

// HashRouter를 사용하지만 직접 접근 시에도 안전하게 같은 화면을 제공합니다.
await writeFile(resolve(distDir, '404.html'), html, 'utf8')

// GitHub Pages의 "Deploy from a branch > main /(root)" 방식에서도
// 그대로 작동하도록 루트에 빌드 결과를 복사합니다.
await rm(rootAssets, { recursive: true, force: true })
await mkdir(rootAssets, { recursive: true })
await cp(resolve(distDir, 'assets'), rootAssets, { recursive: true })
await writeFile(rootIndex, html, 'utf8')
await writeFile(root404, html, 'utf8')
await writeFile(resolve(root, '.nojekyll'), '', 'utf8')
await writeFile(resolve(distDir, '.nojekyll'), '', 'utf8')

console.log('배포 파일 준비 완료: 루트 index.html과 dist/index.html')
