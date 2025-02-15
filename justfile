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
