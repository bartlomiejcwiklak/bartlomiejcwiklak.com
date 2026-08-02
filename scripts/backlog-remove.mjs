import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const backlogPath = resolve(process.cwd(), 'public/backlog.json');

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const titleOrId = process.argv.slice(2).join(' ').trim();

  if (!titleOrId) {
    throw new Error('Usage: npm run backlog:remove -- "game-title"');
  }

  const raw = await readFile(backlogPath, 'utf8');
  const backlog = JSON.parse(raw);
  const id = slugify(titleOrId);
  const nextItems = backlog.items.filter((item) => item.id !== id);

  if (nextItems.length === backlog.items.length) {
    throw new Error(`No game found for id "${id}".`);
  }

  const nextBacklog = {
    updatedAt: new Date().toISOString().slice(0, 10),
    items: nextItems,
  };

  await writeFile(backlogPath, `${JSON.stringify(nextBacklog, null, 2)}\n`, 'utf8');
  console.log(`Removed ${id} from backlog.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
