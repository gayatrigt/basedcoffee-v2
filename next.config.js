/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import pwa from 'next-pwa';

const withPWA = pwa({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    // swSrc: 'public/sw.js'
})


/** @type {import("next").NextConfig} */
const config = {};

export default withPWA(config);
