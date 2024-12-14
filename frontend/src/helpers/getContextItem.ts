export const getContextItem = (itemName: string) => {
    
    const item = localStorage.getItem(itemName);
    if (!item && itemName.includes('user')) {
        console.error('No user found in localStorage');
        return null;
    } else if (!item) 
        { return null }
    else 
        { return JSON.parse(item) }
}
