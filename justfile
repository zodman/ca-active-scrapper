default:
  just -l

s name:
  python main.py {{name}}
sport name:
  python main.py {{name}} &&  python display.py


pickleball:
  just sport pickleball

volleyball:
  just sport volleyball

alias d:=deploy
deploy:
  #!/bin/bash
  set -ae 
  INVOKE_RUN_ECHO=true
  FABRIC_RUN_ECHO=true
  python deploy.py
update_req:
  pip install -r requirements.in
  pip-compile  requirements.in -o requirements.txt


t:
  rm .*.db
  just pickleball
