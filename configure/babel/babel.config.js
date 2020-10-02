module.exports = function configureBabel(api) {
   api.cache(false);

   return {
      presets: [
         [require('@babel/preset-env'), { useBuiltIns: 'usage', corejs: { version: 3 } }],
         [require('@babel/preset-typescript'), { allowNamespaces: true, allowDeclareFields: true }],
      ],
      plugins: [
         [require('@babel/plugin-proposal-nullish-coalescing-operator')],
         [require('@babel/plugin-proposal-object-rest-spread')],
         [require('@babel/plugin-proposal-optional-chaining')],
      ],
      env: {
         cjs: { presets: [[require('@babel/preset-env'), { modules: 'cjs' }]] },
         esm: { presets: [[require('@babel/preset-env'), { modules: false }]] },
      },
   };
};
