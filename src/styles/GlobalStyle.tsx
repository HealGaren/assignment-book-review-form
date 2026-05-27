import { css, Global } from '@emotion/react';

export const GlobalStyle = () => (
  <Global
    styles={(theme) => css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: ${theme.colors.text};
        background: ${theme.colors.background};
        line-height: 1.6;
      }
    `}
  />
);
