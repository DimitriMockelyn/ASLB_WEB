"C:\Program Files\Git\git-bash.exe" --cd="." &
"C:\Program Files\Git\git-bash.exe" --cd="./protectedApi" -c "npm start" &
"C:\Program Files\Git\git-bash.exe" --cd="./ui" -c "npm run watch"  &
"C:\Program Files\Git\git-bash.exe" --cd="./ui/dist" -c "./run_server.sh" &
