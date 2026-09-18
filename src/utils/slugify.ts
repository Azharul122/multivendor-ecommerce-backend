import e from "express";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKC") 
    .trim()
    .toLowerCase()                            
    .replace(/[\u0300-\u036f]/g, "")           
    .replace(/[^\p{L}\p{N}\s-]/gu, "")         
    .replace(/\s+/g, "-")                    
    .replace(/-+/g, "-")                       
    .replace(/^-+|-+$/g, "");                 
}

export default slugify