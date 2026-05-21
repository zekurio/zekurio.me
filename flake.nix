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
          buildInputs = with pkgs; [
            nodejs_24
            pnpm
          ];

          shellHook = ''
            export ZEKURIO_ME_ROOT="$PWD"
            export PNPM_HOME="$PWD/.pnpm-home"
            export PATH="$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}
