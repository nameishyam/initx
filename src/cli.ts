import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { blue, green, cyan, red, bold } from "kolorist";
import { askQuestions } from "./prompts.js";
import { generateBackendCode, addProxyToViteConfig } from "./generator.js";

async function run() {
  const response = await askQuestions(process.argv[2]);
  const { projectName, language, framework, authStrategy, autoRun } = response;
  if (!projectName) process.exit(1);

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.log(red(`\nError: Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  console.log(cyan(`\nBuilding ${projectName}...`));
  fs.mkdirSync(targetDir);

  console.log(blue("Scaffolding Frontend..."));
  const currentFramework = language === "ts" ? `${framework}-ts` : framework;
  try {
    execSync(
      `npm create vite@latest frontend -- --template ${currentFramework} --no-interactive`,
      {
        cwd: targetDir,
        stdio: "pipe",
        env: {
          ...process.env,
          npm_config_yes: "true",
          VITE_SKIP_PROMPT: "true",
        },
      },
    );
  } catch (err) {
    console.log(red("Vite note: moving to backend..."));
  }

  console.log(blue("Scaffolding Backend..."));
  const backendDir = path.join(targetDir, "backend");
  fs.ensureDirSync(backendDir);
  execSync(`npm init -y`, { cwd: backendDir, stdio: "ignore" });

  console.log(blue("Installing Dependencies..."));
  execSync(
    `npm install express ${authStrategy === "cors" ? "cors" : ""} nodemon`,
    {
      cwd: backendDir,
      stdio: "ignore",
    },
  );

  const backendPkg = fs.readJsonSync(path.join(backendDir, "package.json"));
  backendPkg.scripts = { start: "node index.js", dev: "nodemon index.js" };
  fs.writeJsonSync(path.join(backendDir, "package.json"), backendPkg, {
    spaces: 2,
  });
  fs.writeFileSync(
    path.join(backendDir, "index.js"),
    generateBackendCode(authStrategy),
  );

  if (authStrategy === "proxy") {
    const ext = language === "ts" ? "ts" : "js";
    const configPath = path.join(targetDir, "frontend", `vite.config.${ext}`);

    addProxyToViteConfig(configPath);
  }

  const rootPkg = {
    name: projectName,
    version: "1.0.0",
    scripts: {
      "install-all":
        "npm install && npm install --prefix frontend && npm install --prefix backend",
      dev: 'npx concurrently "npm run dev --prefix frontend" "npm run dev --prefix backend"',
    },
    devDependencies: { concurrently: "^8.2.0" },
  };
  fs.writeJsonSync(path.join(targetDir, "package.json"), rootPkg, {
    spaces: 2,
  });

  console.log(green("\nInitx setup complete!"));

  if (autoRun) {
    console.log(blue("Installing all dependencies..."));
    execSync(`npm run install-all`, {
      cwd: targetDir,
      stdio: "inherit",
    });

    console.log(blue("Starting development servers..."));
    execSync(`npm run dev`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  } else {
    console.log(
      bold(
        `\n  Next steps:\n  1. cd ${projectName}\n  2. npm run install-all\n  3. npm run dev`,
      ),
    );
  }
}

run().catch((err) => {
  console.error(red("Generation failed:"), err);
});
