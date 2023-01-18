import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Album, AlbumLov, AlbumTrack, DbTrack, Track } from './types';

const db = new Database(DB_PATH, { verbose: console.log });

export function getInitialTracks(limit = 50): Track[] {
	const sql = `
  select t.TrackId as trackId
  , t.Name as trackName
  , a.AlbumId as albumId
  , a.Title as albumTitle
  , at.ArtistId as artistId
  , at.Name as artistName
  , g.Name as genre
from tracks t
join albums a
 on t.AlbumId = a.AlbumId
join artists at
 on a.ArtistId = at.ArtistId
join genres g
 on t.GenreId = g.GenreId
limit $limit  
  `;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ limit });
	return rows as Track[];
}

export function searchTracks(searchTerm: string, limit = 50): Track[] {
	const sql = `
  select t.TrackId as trackId
  , t.Name as trackName
  , a.AlbumId as albumId
  , a.Title as albumTitle
  , at.ArtistId as artistId
  , at.Name as artistName
  , g.Name as genre
from tracks t
join albums a
 on t.AlbumId = a.AlbumId
join artists at
 on a.ArtistId = at.ArtistId
join genres g
 on t.GenreId = g.GenreId
where lower(t.Name) like lower('%' || $searchTerm || '%')
limit $limit  
  `;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ searchTerm, limit });
	return rows as Track[];
}

export function getAlbumById(albumId: number): Album {
	const sql = `
  select a.AlbumId as albumId
     , a.Title as albumTitle
     , at.ArtistId as artistId
     , at.Name as artistName
  from albums a
  join artists at on a.AlbumId = at.ArtistId
 where a.AlbumId = $albumId;
  `;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ albumId });
	return row as Album;
}

export function getAlbumTracks(albumId: number): AlbumTrack[] {
	const sql = `
  select t.TrackId as trackId
     , t.Name as trackName
     , t.Milliseconds as trackMs
  from tracks t
 where t.AlbumId = $albumId
order by t.TrackId
`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ albumId });
	return rows as AlbumTrack[];
}

export function updateAlbumTitle(albumId: number, albumTitle: string): void {
	const sql = `
  update albums
     set Title = $albumTitle
   where AlbumId = $albumId
`;
	const stmnt = db.prepare(sql);
	stmnt.run({ albumId, albumTitle });
}

export function insertTrack(track: DbTrack): void {
	const sql = `
  insert into tracks (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
  values ($name, $albumId, 1, $genreId, $composer, $milliseconds, 8679940, 0.99)
`;
	const stmnt = db.prepare(sql);
	stmnt.run(track);
}

export function getLovAlbums(searchTerm: string | null = null) {
	const sql = `
  select a.AlbumId as id
       , a.Title as title
       , ar.Name as artist
    from albums a
    join artists ar
      on a.ArtistId = ar.ArtistId
   where $searchTerm is null
      or (
           lower(a.Title) like lower('%' || $searchTerm || '%')
        or lower(ar.Name) like lower('%' || $searchTerm || '%')
      )
    limit 25
  `;

	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ searchTerm }) as AlbumLov[];
	return rows;
}

export function getLovGenres(searchTerm: string | null = null) {
	const sql = `
  select g.GenreId as id
       , g.Name as genre
    from genres g
   where $searchTerm is null
      or lower(g.Name) like lower('%' || $searchTerm || '%')
    limit 25
  `;

	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ searchTerm }) as AlbumLov[];
	return rows;
}
