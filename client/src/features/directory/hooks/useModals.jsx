/**
 * useModals Hook
 * Manages modal open/close state for directory feature
 */

import { useState, useCallback } from "react";

export const useModals = () => {
    const [modals, setModals] = useState({
        createFolder: false,
        upload: false,
        rename: false,
        delete: false,
        fileViewer: false,
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState("file"); // 'file' or 'folder'

    const openModal = useCallback((modalName, item = null, type = "file") => {
        setSelectedItem(item);
        setItemType(type);
        setModals((prev) => ({ ...prev, [modalName]: true }));
    }, []);

    const closeModal = useCallback((modalName) => {
        setModals((prev) => ({ ...prev, [modalName]: false }));
        // Clear selection after closing (with slight delay for animation)
        setTimeout(() => setSelectedItem(null), 200);
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            createFolder: false,
            upload: false,
            rename: false,
            delete: false,
            fileViewer: false,
        });
        setSelectedItem(null);
    }, []);

    return {
        modals,
        selectedItem,
        itemType,
        openModal,
        closeModal,
        closeAllModals,
    };
};
