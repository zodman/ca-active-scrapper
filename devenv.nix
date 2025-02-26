{ pkgs, lib, config, ... }: {
  packages = [
    pkgs.just
  ];
  languages.javascript.enable = true;
  languages.python = {
    enable = true;
    package = pkgs.python311;
  };

  enterShell = ''
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    python all.py pickeball
    cd src/ && npm i && npx parcel build
    cd ..
  '';

}
