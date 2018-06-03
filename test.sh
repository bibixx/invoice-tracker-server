#!/bin/bash

osascript -e 'display notification "Tests have started" with title "Tests"'
for number in {1..50}
do
  if yarn test --forceExit -b ; then
  # if true ; then
    echo "OK!"
    echo $number / 50

    if [[ $((number%5)) -eq 0 ]]; then
      echo "$number=$( date +%s )"
      osascript -e "display notification \"$number / 50 tests have been completed\" with title \"Tests\""
    fi
  else 
    osascript -e 'display notification "One of tests have failed" with title "Tests"'
    exit 1
  fi
done

osascript -e 'display notification "Tests finished successfully" with title "Tests"'
exit 0