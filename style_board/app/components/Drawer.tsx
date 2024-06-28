'use client';
import React, { useState, useRef } from "react";


export default function Drawer({isOpen}:bool) {
    // const [drawerOpen, setDrawerOpen] = useState(false);
    // const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    // const handleCardClick = (card: Card) => {
    //     setSelectedCard(card);
    //     setDrawerOpen(true);
    // };

    // const handleCloseDrawer = () => {
    //     setDrawerOpen(false);
    //     setSelectedCard(null);
    // };

  return (
    <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <button className="btn btn-square btn-sm" >✕</button>

      </div>
    </div>
  );
};

