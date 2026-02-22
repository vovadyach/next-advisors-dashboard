import path from 'path';
import fs from 'fs';

export function readJSON<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
