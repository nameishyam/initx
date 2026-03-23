#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { blue, green, cyan, red } from "kolorist";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.log(red("\n❌ Error: Please specify a project name."));
    console.log(blue("Usage: npx create-initx <project-name>"));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, "../templates");

  if (fs.existsSync(targetDir)) {
    console.log(red(`\n❌ Error: Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  console.log(cyan(`\n🚀 Creating your fullstack app: ${projectName}...`));

  try {
    await fs.copy(templateDir, targetDir);

    const foldersToFix = ["frontend", "backend"];

    for (const folder of foldersToFix) {
      const oldPath = path.join(targetDir, folder, "gitignore");
      const newPath = path.join(targetDir, folder, ".gitignore");

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

    const rootPkgPath = path.join(targetDir, "package.json");
    if (fs.existsSync(rootPkgPath)) {
      const pkg = await fs.readJson(rootPkgPath);
      pkg.name = projectName;
      await fs.writeJson(rootPkgPath, pkg, { spaces: 2 });
    }

    console.log(green("\n✨ Project generated successfully!"));
    console.log(
      blue(`
    Next steps:
    1. cd ${projectName}
    2. npm run install-all
    3. npm run dev
    `),
    );
  } catch (err) {
    console.error(red("\n❌ An error occurred:"), err);
    process.exit(1);
  }
}

run().catch(console.error);
