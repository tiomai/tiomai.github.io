# Kokomonster asset naming convention

The `KOKO-` prefix has been removed. Every catalogue item receives a unique code in the form:

`TYPE-COLLECTION-NNN-description.extension`

Types: `CHR` character, `SCN` scene, `CMP` reusable component, `CAM` campaign artwork, `ART` editable master, `LYR` editable layer, `FRM` frame, `THM` thumbnail, `DOC` documentation, `MNF` manifest, `UI` interface guidance, `ARC` archive.

Collections: `365`, `JP108`, `STYLEA`, `JPE`, `ARCH`, `LIB`. IDs are stable; descriptions are lowercase hyphenated slugs. Revisions use `-r01`, and previews use `-thumb` or `-preview`.

Catalogue cards carry the same code in `data-code`, and `asset/MNF-LIBRARY-001-manifest.json` records the card, thumbnail, and direct Drive URL.
