import Document, { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

//import injectTapEventPlugin from "react-tap-event-plugin";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// try {
//   if (typeof window !== "undefined") {
//     injectTapEventPlugin();
//   }
// } catch (e) {}

export default class BaseDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
            rel="stylesheet"
          />
          <link rel="stylesheet" type="text/css" href="./static/app.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
