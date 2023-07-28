import RuleSet from "@/components/ruleset";
import Wechat from "@/components/wechat";
import { Button, Field, Input, Text, Textarea, Title1 } from "@fluentui/react-components";

export default function WeChatCash() {
    return (
        <div className="mx-auto h-screen">
            <div className="mx-auto container">
                <div className="pb-[50rem]">
                    <div className="px-8 pt-8 pb-12">
                        <div className="">
                            <Field label="Account Name">
                                <Input placeholder="Account Name in your Beancount, eg. Asset:Zhangsan:Wechat:Cash, Asset:Lisi:CNY:Wechat" />
                            </Field>
                        </div>
                    </div>
                    <div className="px-8 pb-12">
                        <div className="pb-4">
                            <Field label="WeChat Transaction CSV">
                                <Textarea />
                            </Field>
                        </div>
                        <div className="flex">
                            <Text className="">
                                <a className="pr-4">Or</a>
                                <Button disabled={true}>Load from File</Button>
                            </Text>
                        </div>
                    </div>

                    <div className="px-8">
                        <div className="pb-4">
                            <Text>
                                Setup Rule Set
                            </Text>
                        </div>
                        <div>
                            <RuleSet></RuleSet>
                        </div>
                    </div>
                </div>
                <Wechat></Wechat>
            </div>
        </div>
    )
}
