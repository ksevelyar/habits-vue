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
        ];
        VITE_BACK="http://habits.localhost:3003";
      };

      packages.default = pkgs.buildNpmPackage {
        name = "habits-vue";

        buildInputs = with pkgs; [
          nodejs_26
        ];

        src = self;

        npmDepsHash = "sha256-qM+M/h4XHSCVjK1hObhPTkuD7HFWltJYXN8cR+wo1YI=";

        VITE_BACK = "https://api.habits.rusty-cluster.net";
        npmBuild = "npm run build";

        installPhase = ''
          mkdir $out
          cp -r dist/* $out/
        '';
      };
    });
}
