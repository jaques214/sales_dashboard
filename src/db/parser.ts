import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";

const options = {
    ignoreAttributes: true,
    attrNodeName: "attr",
    ignoreDeclaration: true,
    removeNSPrefix: true,
    allowBooleanAttributes: true,
    trimValues: true,
    ignoreNameSpace: false,
    parseNodeValue: true,
    parseAttributeValue: true,
    transformTagName: (tagName: string) => {
        return tagName.charAt(0).toLowerCase() + tagName.substring(1)
    }
};

const parser = new XMLParser(options);

const readXMLFile = () => {
    const path = './src/files/SAFT_TP1_01-01-2022_31-12-2022.xml';
    try {
        const data = readFileSync(path, 'utf8');
        const jsonObj = parser.parse(data);
        return jsonObj;
    } catch (err) {
        console.error(err);
        return "";
    }
}

export default readXMLFile;