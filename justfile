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
  python deploy.py
update_req:
  pip install -r requirements.in
  pip-compile  requirements.in -o requirements.txt



