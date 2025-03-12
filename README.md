
# Issue: [Nuxt Bridge](https://nuxt.com/docs/bridge/overview) fails to run or build

I stumbled upon the bug reported in https://github.com/nuxt/bridge/issues/1469

This repo contains a minimal Nuxt 2 application with `nuxt-bridge` and the following config:

```js
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  ssr: false,
  bridge: {
    vite: true,
    nitro: true
  }
});
```

And these scripts:

```json
"scripts": {
  "dev": "nuxi dev",
  "build": "nuxi build",
  "start": "nuxi preview"
},
```

When running `yarn dev`, I get the following error related to `unenv/dist/runtime/runtime/mock/proxy.mjs`:

```
[nitro 11:51:24 AM]  ERROR  Error: Could not load /Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs (imported by node_modules/nitropack/dist/runtime/internal/error/dev.mjs): ENOENT: no such file or directory, open '/Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs'
```

Looks like nitropack is trying to import or use `unenv/dist/runtime/runtime/mock/proxy.mjs`, but note the double `runtime` in the path.

That file is in fact in `unenv/dist/runtime/mock/proxy.mjs`.

<details>
<summary>Full error log here</summary>

```sh
yarn run v1.22.21
warning package.json: No license field
$ nuxi dev
Nuxt 2.18.1 with Nitro 2.11.6                                                                                nuxi  11:51:21 AM
[get-port] Unable to find an available port (tried 3000 on host "localhost"). Using alternative port 3001.         11:51:21 AM
                                                                                                                   11:51:21 AM
  ➜ Local:    http://localhost:3001/
  ➜ Network:  use --host to expose

ℹ Module nuxt-bridge took 9.69ms to setup.                                                                        11:51:23 AM

[11:51:23 AM]  ERROR  (node:16744) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead.
(Use node --trace-deprecation ... to show where the warning was created)


 WARN  No valid compatibility date is specified.                                                             nitro 11:51:23 AM

ℹ Using 2024-04-03 as fallback.                                                                             nitro 11:51:23 AM
  Please specify compatibility date to avoid unwanted behavior changes:
     - Add compatibilityDate: '2025-03-12' to the config file.
     - Or set COMPATIBILITY_DATE=2025-03-12 environment variable.

ℹ Module imports took 1.19ms to setup.                                                                            11:51:23 AM
🧪  Vite mode is experimental and some nuxt modules might be incompatible                                          11:51:23 AM
    If you find a bug, please report via https://github.com/nuxt/bridge/issues with a minimal reproduction.
ℹ Module nuxt-bridge:vite took 0.83ms to setup.                                                                   11:51:23 AM
ℹ Preparing project for development                                                                               11:51:23 AM
ℹ Initial build may take a while                                                                                  11:51:23 AM
✔ Builder initialized                                                                                             11:51:23 AM
✔ Nuxt files generated                                                                                            11:51:23 AM
ℹ Vite warmed up in 5ms                                                                                           11:51:24 AM

[nitro 11:51:24 AM]  ERROR  Error: Could not load /Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs (imported by node_modules/nitropack/dist/runtime/internal/error/dev.mjs): ENOENT: no such file or directory, open '/Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs'


undefined
```

</details>

When I try to `yarn build`, I get the same error:

```
[nitro 11:54:18 AM]  ERROR  Error: Could not load /Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs: ENOENT: no such file or directory, open '/Users/dev/Sites/test/bridging/node_modules/unenv/dist/runtime/runtime/mock/proxy.mjs'
```

## Turning off Nuxt Bridge works

If you check out the [bridge-off]([url](https://github.com/nicodevs/bridging/tree/bridge-off)) branch of this repo, you will find this config:

```js
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  ssr: false,
  bridge: false
});
```

And these scripts:

```json
"scripts": {
  "dev": "nuxt2 dev",
  "build": "nuxt2 build",
  "start": "nuxt2 preview"
},
```

Then, the app works. The issue only appears when turning on any option of `bridge`.
