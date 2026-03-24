import prompts from "prompts";

export async function askQuestions(initialName: string) {
  return await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: initialName || "my-fullstack-app",
    },
    {
      type: "select",
      name: "language",
      message: "Select a language:",
      choices: [
        { title: "JavaScript", value: "js" },
        { title: "TypeScript", value: "ts" },
      ],
    },
    {
      type: "select",
      name: "authStrategy",
      message: "Backend Connection Strategy:",
      choices: [
        { title: "Proxy (Vite config)", value: "proxy" },
        { title: "CORS (Express middleware)", value: "cors" },
      ],
    },
  ]);
}
