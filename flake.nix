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
          pkgs.nodejs_26
          pkgs.vue-language-server
          pkgs.vtsls
        ];
        VITE_BACK="http://api.habits.localhost:3003";
        VUE_LANGUAGE_SERVER_PATH = "${pkgs.vue-language-server}/lib/language-tools/packages/language-server";
      };

      packages.default = pkgs.buildNpmPackage {
        name = "habits-vue";

        buildInputs = with pkgs; [
          nodejs_26
        ];

        src = self;

        npmDepsHash = "sha256-7ZA9B3fXVN6d+IWduZEp3q3EUKmUHM7YtrzBaZn915g=";

        VITE_BACK = "https://api.habits.rusty-cluster.net";
        npmBuild = "npm run build";

        installPhase = ''
          mkdir $out
          cp -r dist/* $out/
        '';
      };
    });
}
