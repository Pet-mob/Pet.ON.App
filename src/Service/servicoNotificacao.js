import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export class servicoNotificacao {
  static async registrarParaNotificacoesPush() {
    let token;

    if (Device.isDevice) {
      const { status: statusExistente } =
        await Notifications.getPermissionsAsync();
      let statusFinal = statusExistente;

      if (statusExistente !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        statusFinal = status;
      }

      if (statusFinal !== "granted") {
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    return token;
  }

  static async agendarNotificacoesAgendamento(agendamento) {
    const { dataAgendamento, horaAgendamento, nomePet, tipoServico } =
      agendamento;

    const dataAgendada = new Date(`${dataAgendamento}T${horaAgendamento}`);

    // Notificação 1 dia antes
    const umDiaAntes = new Date(dataAgendada);
    umDiaAntes.setDate(dataAgendada.getDate() - 1);
    umDiaAntes.setHours(10, 0, 0); // Define para 10:00

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Agendamento",
        body: `Amanhã: ${tipoServico} para ${nomePet} às ${horaAgendamento}`,
        data: { agendamento },
      },
      trigger: umDiaAntes,
    });

    // Notificação 1 hora antes
    const umaHoraAntes = new Date(dataAgendada);
    umaHoraAntes.setHours(umaHoraAntes.getHours() - 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Agendamento",
        body: `Em 1 hora: ${tipoServico} para ${nomePet}`,
        data: { agendamento },
      },
      trigger: umaHoraAntes,
    });
  }
}
