---
title: "adam"
description: "compact homelab system with zraid1 storage and dedicated arc graphics."
role: "storage / compute"
status: "active"
os: "nixos 26.11 (unstable)"
specs:
  - label: "cpu"
    value: "ryzen 5 5600x"
  - label: "ram"
    value: "32gb ram"
  - label: "flash"
    count: 2
    value: "2 × samsung 870 evo ssds boot zfs mirror"
  - label: "spinning rust"
    count: 3
    value: "3 × 8tb in zraid1"
  - label: "gpu"
    count: 1
    value: "intel arc a380"
  - label: "psu"
    value: "sfx psu"
  - label: "case"
    value: "jonsbo n6"
---
