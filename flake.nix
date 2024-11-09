{
  description = "habits-vue";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

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
          pkgs.nodejs_20
        ];

        shellHook = ''
          export VITE_BACK=http://habits.lcl:5000
        '';
      };

      packages.default = pkgs.buildNpmPackage {
        name = "habits-vue";

        buildInputs = with pkgs; [
          nodejs_20
        ];

        src = self;

        npmDepsHash = "sha256-Nvb6TkkCiOA68G27mq549hKlEz4mWBuzVia8dpMKmwI=";

        npmBuild = "npm run build";

        installPhase = ''
          mkdir $out
          cp -r dist/* $out/
        '';
      };
    });
}
