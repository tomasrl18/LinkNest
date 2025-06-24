/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

type Link = {
  id: string;
  url: string;
  title: string;
};

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const fetchLinks = async () => {
    // TODO: Implement fetching logic here
  };
  useEffect(() => { fetchLinks(); }, []);
  /* return { links, addLink, updateLink, deleteLink }; */
  return { links };
}