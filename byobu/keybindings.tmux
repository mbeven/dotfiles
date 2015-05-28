# byobu keybindings when tmux is the backend
# lives-at: ~/.byobu/keybindings.tmux

unbind-key -n C-a
set -g prefix ^A
set -g prefix2 ^A
bind a send-prefix
unbind-key -n C-Left
unbind-key -n C-Right

# We want Option-<Direction> to move between words, so unbind it here
unbind-key -n M-Left
unbind-key -n M-Right
