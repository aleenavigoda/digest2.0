
import { supabase } from '../lib/supabase';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_image?: string;
  description?: string;
  category?: string;
  created_at?: string;
}

export const bookService = {
  async getBooks(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching book with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async createBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert([book])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateBook(id: string, book: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .update(book)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating book with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting book with id ${id}:`, error);
      throw error;
    }
  }
};
