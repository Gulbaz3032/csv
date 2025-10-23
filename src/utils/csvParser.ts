import { parse } from "csv-parse";
import { Readable } from "stream";
import https from "https";
import http from "http";

export type CSVRow = Record<string, string>;

//  Parse CSV from a Buffer
export const parseCSVBuffer = async (buffer: Buffer): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const rs = Readable.from(buffer);
    rs.pipe(parser)
      .on("data", (row: CSVRow) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err: Error) => reject(err));
  });
};

//  NEW: Parse CSV directly from Cloudinary URL
export const parseCSVFromURL = async (url: string): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      res.pipe(parser)
        .on("data", (row: CSVRow) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (err: Error) => reject(err));
    }).on("error", (err) => reject(err));
  });
};
