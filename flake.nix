{
  description = "zekurio.me";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          # Wrangler comes from node_modules/.bin rather than nixpkgs, whose
          # copy lags behind and bundles a workerd too old for the
          # compatibility_date in wrangler.jsonc.
          buildInputs = with pkgs; [
            nodejs_24
            pnpm
          ];

          shellHook = ''
            export ZEKURIO_ME_ROOT="$PWD"
            export PNPM_HOME="$PWD/.pnpm-home"
            export PATH="$PWD/node_modules/.bin:$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}
