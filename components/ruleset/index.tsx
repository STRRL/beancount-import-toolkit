import { Button, Card, CardFooter, CardHeader, CardPreview, Divider, tokens, Text } from "@fluentui/react-components";

export default function RuleSet() {
    return (
        <div>
            <div className="pb-4 grid grid-cols-2">
                <Card>
                    <CardPreview >
                        <div>
                            <Divider className="p-4">When</Divider>
                            <div className="p-4">
                                <Text>{"field \"description\" contains \"PlayStation Network\""}</Text>
                            </div>
                            <Divider className="px-4 py-1">Then</Divider>
                            <div>
                                <div className="px-4 py-1"> <Text>{"set payee to \"SONY PlayStation\""}</Text></div>
                                <div className="px-4 py-1">  <Text>{"set target to \"Expenses:CN:电子订阅\""}</Text></div>
                                <div className="px-4 py-1">  <Text>{"set transaction as completed"}</Text></div>
                            </div>

                        </div>
                    </CardPreview>
                    <CardFooter className="justify-evenly">
                        <Button>Edit</Button>
                        <Button>Delete</Button>
                    </CardFooter>
                </Card>
            </div>

            <div>Total: 233 Rules</div>
        </div>
    )
}
