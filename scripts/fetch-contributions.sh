#!/usr/bin/env bash
set -euo pipefail

login="${1:?usage: fetch-contributions.sh <login>}"
out="src/data/contributions.json"

gh api graphql -f login="$login" -f query='
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }' --jq '.data.user.contributionsCollection.contributionCalendar
    | { total: .totalContributions,
        weeks: [.weeks[] | [.contributionDays[] | { date, count: .contributionCount }]] }' > "$out.tmp"

mv "$out.tmp" "$out"
