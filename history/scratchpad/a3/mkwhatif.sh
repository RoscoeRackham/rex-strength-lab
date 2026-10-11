#!/bin/sh
grep -c "state.oSame = true;   // Ollie is as strong as Rex" /home/user/dino-strength-sim/dist/preview.html
sed 's#state.oSame = true;   // Ollie is as strong as Rex#/* scratch what-if copy */   // Ollie is as strong as Rex#' /home/user/dino-strength-sim/dist/preview.html > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/preview-whatif.html
