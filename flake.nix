{
  description = "habits-vue";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_24
        ];
        VITE_BACK="http://habits.lcl:3003";
      };

      packages.default = pkgs.buildNpmPackage {
        name = "habits-vue";

        buildInputs = with pkgs; [
          nodejs_24
        ];

        src = self;

        npmDepsHash = "sha256-5GNn+3/aFB465TvvlXx5B5kl5cga9hdqAYCgC8PRq0o=";

        VITE_BACK = "https://api.habits.rusty-cluster.net";
        npmBuild = "npm run build";

        installPhase = ''
          mkdir $out
          cp -r dist/* $out/
        '';
      };
    });
}
