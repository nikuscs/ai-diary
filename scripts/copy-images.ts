import { cpSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { IMAGES_DIR } from "../src/lib/config";

const dest = join(process.cwd(), "public", "images");

mkdirSync(dest, { recursive: true });

try {
  const files = readdirSync(IMAGES_DIR);
  for (const file of files) {
    cpSync(join(IMAGES_DIR, file), join(dest, file));
  }
  console.log(`Copied ${files.length} images to public/images/`);
} catch {
  console.log("No images to copy");
}
