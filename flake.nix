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
    });
}
