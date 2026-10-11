#!/bin/bash
# usage: ftsq.sh <outfile> <query>
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
curl -sS -m 90 -A "$UA" -G "https://archive.org/services/search/beta/page_production/" --data-urlencode "service_backend=fts" --data-urlencode "page_type=collection_details" --data-urlencode "page_target=texts" --data-urlencode "user_query=$2" -o "$1"
python3 -I "$(dirname "$0")/fts.py" "$1"
