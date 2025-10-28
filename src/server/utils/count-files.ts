import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const IGNORED_DIRECTORIES = new Set([
  '.git',
  'dist',
  'node_modules',
])

export async function countFiles(root: string): Promise<number> {
  let total = 0

  let entries: any[]
  try {
    entries = await readdir(root, { withFileTypes: true, encoding: 'utf8' } as any)
  }
  catch {
    return 0
  }

  for (const entry of entries) {
    const name = String((entry as any).name)
    if (entry.isSymbolicLink())
      continue

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(name))
        continue
      total += await countFiles(join(root, name))
    }
    else if (entry.isFile()) {
      total += 1
    }
  }

  return total
}
