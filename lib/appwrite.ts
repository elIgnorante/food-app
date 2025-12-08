
import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

// Establece la configuración de Appwrite utilizando variables de entorno
export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: 'com.az.food',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: '68cd6c4800125d6c04c4',
    bucketId: '68f2a5d8002fe1cf39e1',
    userCollectionId: 'user',
    categoriesCollectionId: 'categories',
    menuCollectionId: 'menu',
    customizationsCollectionId: 'customizations',
    menuCustomizationsCollectionId: 'menu_customizations',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        // Elimina la sesión actual
        await account.deleteSession('current');
        return { success: true };
    } catch (e) {
        console.log(e);
        return { success: false, error: (e as Error).message ?? String(e) };
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) return null;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser || !currentUser.documents || currentUser.documents.length === 0) return null;

        return currentUser.documents[0];
    } catch (e: any) {
        console.log(e);

        // Si Appwrite indica que el usuario es "guests" o faltan scopes, devolvemos null (no autenticado)
        const msg = e?.message || String(e);
        if (
            msg.includes('missing scopes') ||
            msg.toLowerCase().includes('guest') ||
            msg.toLowerCase().includes('unauthorized') ||
            msg.includes('User (role: guests)')
        ) {
            return null;
        }

        // Para otros errores, lanzamos para que se manejen en capas superiores
        throw new Error(msg);
    }
}

export const updateUserProfile = async (
    userId: string,
    data: Partial<{
        name: string;
        email: string;
        avatar: string;
        phone: string;
        address1: string;
        address2: string;
    }>,
) => {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            data,
        );

        return updatedUser;
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}
