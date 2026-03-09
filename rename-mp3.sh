#!/bin/bash
# Rename MP3s on SD card to short clean names
# Run this from the SD card directory:
# cd "/Volumes/1GB SD CARD"
# bash rename-mp3.sh

SD="/Volumes/1GB SD CARD"
cd "$SD" || { echo "SD card not found!"; exit 1; }

rename_file() {
  local old="$1"
  local new="$2"
  if [ -f "$old" ]; then
    mv "$old" "$new"
    echo "✅ $old → $new"
  else
    echo "⚠️  NOT FOUND: $old"
  fi
}

# Trump Came Back (date-stamped version)
rename_file "TRUMP3426.mp3"                                    "tcb.mp3"

# Runnin Wild
rename_file "Runnin Wild (Woods Song).mp3"                     "rw.mp3"

# If Life Ain't Crazy
rename_file "If Life Aint Crazy I Aint Country.mp3"            "ilac.mp3"

# Same Songs on the Radio
rename_file "Same Songs on the Radio.mp3"                      "sstr.mp3"

# She's Got a Crush on Me
rename_file "Shes Got a Crush on Me v1.mp3"                    "sgcm.mp3"

# Love Song (use v2 if exists, else v1)
if [ -f "Love Song v2.mp3" ]; then
  rename_file "Love Song v2.mp3"                               "ls.mp3"
else
  rename_file "Love Song v1.mp3"                               "ls.mp3"
fi

# Sail Away (use v2 if exists, else v1)
if [ -f "Sail Away v2.mp3" ]; then
  rename_file "Sail Away v2.mp3"                               "sa.mp3"
else
  rename_file "Sail Away v1.mp3"                               "sa.mp3"
fi

# She's a Beauty
rename_file "Shes a Beauty v1.mp3"                             "sab.mp3"

# Crazy Boy
rename_file "Crazy Boy (Drink Yourself to Death).mp3"          "cb.mp3"

# Riding Like the Wind
rename_file "Riding Like the Wind.mp3"                         "rltw.mp3"

# Funk Overdrive
rename_file "Funk Overdrive (Birthday Suit).mp3"               "fo.mp3"

# Presents of the Lord
rename_file "Presents of the Lord (Christmas Song).mp3"        "potl.mp3"

# There's Nothin Like Me with You
rename_file "Theres Nothin Like Me with You v1.mp3"            "tnlmy.mp3"

# Star Man
rename_file "Star Man v1.mp3"                                  "sm.mp3"

# Candy Girl
rename_file "Candy Girl.mp3"                                   "cg.mp3"

# Runaway
rename_file "Runaway.mp3"                                      "run.mp3"

# Party Town
rename_file "Party Town.mp3"                                   "pt.mp3"

# She's So Beautiful
rename_file "Shes So Beautiful.mp3"                            "ssb.mp3"

# Rockin the Night Away
rename_file "Rockin the Night Away v1.mp3"                     "rtna.mp3"

# Big Money Dreams
rename_file "Big Money Dreams.mp3"                             "bmd.mp3"

# War Pigs
rename_file "War Pigs.mp3"                                     "wp.mp3"

echo ""
echo "🎵 Done! All MP3s renamed. Now upload them to GitHub."
