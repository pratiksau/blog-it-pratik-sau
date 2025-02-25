#!/bin/bash

# Fix for Ruby LSP activation with rbenv on Rosetta with Intel Homebrew
arch -x86_64 /usr/local/bin/rbenv exec ruby -EUTF-8:UTF-8 "$@"
