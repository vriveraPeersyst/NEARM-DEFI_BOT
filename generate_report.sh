#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="repo_report.txt"

# 1) Start report
echo "Generating report..." >"$OUTPUT_FILE"

# 2) Load non-blank, non-comment lines from .gitignore (trim trailing slashes/spaces)
if [[ -f .gitignore ]]; then
  patterns=$(grep -E -v '^\s*(#|$)' .gitignore \
    | sed -e 's/[[:space:]]*$//' -e 's#/*$##')
else
  patterns=""
fi

# 3) Append directory tree (pruned by .gitignore patterns if any)
echo "======== DIRECTORY TREE ========" >>"$OUTPUT_FILE"
if [[ -n "$patterns" ]]; then
  # join patterns with '|' for tree -I
  ignore_arg=$(printf "%s\n" "$patterns" | paste -sd '|' -)
  tree --prune -I "$ignore_arg" >>"$OUTPUT_FILE"
else
  tree >>"$OUTPUT_FILE"
fi

# 4) Append contents of tracked or filtered .ts/.js/.json files
echo -e "\n======== FILE CONTENTS ========" >>"$OUTPUT_FILE"

if git rev-parse --is-inside-work-tree &>/dev/null; then
  # In a git repo: only dump tracked files
  git ls-files '*.ts' '*.js' '*.json' | while IFS= read -r file; do
    echo -e "\n---- $file ----" >>"$OUTPUT_FILE"
    cat "$file" >>"$OUTPUT_FILE"
  done
else
  # Not in a git repo: find + filter out any .gitignore patterns (fixed strings)
  if [[ -n "$patterns" ]]; then
    find . -type f \( -iname '*.ts' -o -iname '*.js' -o -iname '*.json' \) \
      | grep -F -v -f <(printf '%s\n' "$patterns") \
      | sed 's|^\./||' \
      | while IFS= read -r file; do
          echo -e "\n---- $file ----" >>"$OUTPUT_FILE"
          cat "$file" >>"$OUTPUT_FILE"
        done
  else
    find . -type f \( -iname '*.ts' -o -iname '*.js' -o -iname '*.json' \) \
      | sed 's|^\./||' \
      | while IFS= read -r file; do
          echo -e "\n---- $file ----" >>"$OUTPUT_FILE"
          cat "$file" >>"$OUTPUT_FILE"
        done
  fi
fi

echo "Report saved to $OUTPUT_FILE"
