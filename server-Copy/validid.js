import express from "express"

export function Idvalidation(id){
    if(id.length!==36){
        return false;
    }
    return true;

}