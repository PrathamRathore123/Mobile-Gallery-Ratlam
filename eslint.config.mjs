import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "vite-project/**",
      "whatsapp-chatbot/**",
      "Instagram image poster/**",
      "*.log",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "react-hooks/purity": "off",
    },
  },
]

export default config
