import fs from "fs";
import { minify } from "html-minifier";
import mjml from "mjml";
import path from "path";
import { getAllMjmlFiles, loadAndCompileTemplate } from "./helpers";

const build = () => {
  const files = getAllMjmlFiles(true);

  // loop through the files if they are mjml files

  files.forEach((file) => {
    const input = fs.readFileSync(path.join(__dirname, file + ".mjml"), "utf8");
    const output = path.join(__dirname, file + ".html");

    fs.writeFileSync(
      output,
      minify(
        mjml(input, {
          keepComments: process.env.NODE_ENV === "development",
        }).html,
        {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
        }
      )
    );

    console.log(`Built ${file} to ${output.replace(__dirname, "")}`);
  });
};

const serve = async () => {
  Bun.serve({
    port: 3000,
    development: true,
    static: {
      "/favicon.ico": new Response(path.join(__dirname, "index.html"), { status: 404 }),
    },

    async fetch(event) {
      const url = new URL(event.url);
      const pathname = url.pathname;

      if (pathname === "/favicon.ico") {
        return new Response(null, {
          status: 404,
          statusText: "Not Found",
          headers: {
            "content-type": "text/plain",
          },
        });
      }

      if (pathname === "/" || pathname === "/index.html") {
        return Response.json(
          {
            message: "Select a file to view",

            files: getAllMjmlFiles(true),
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
      }

      build();

      const file = pathname.replace("/", "").split(".")[0];

      const response = loadAndCompileTemplate(file as "forgot-password", {
        name: "John Doe",
        link: "https://elvora.dev",
        expiry: 15,
      });

      return new Response(response, {
        headers: {
          "content-type": "text/html",
        },
      });
    },
  });
};

function main() {
  const args = process.argv.slice(2);

  if (args[0] === "build") {
    return build();
  }

  if (args[0] === "serve") {
    return serve();
  }

  console.log("Command not found", args[0]);
}

// if it is commandline, run the main function
if (require.main === module) {
  main();
}
